class ClientController < ApplicationController
    before_action :authenticate_developer
    before_action :check_session, except: [:app, :index, :new_session,
        :calculate, :search_geogebra, :send_feedback, :download_image,
        :upload_image]

    #GET /
    def index
        render file: 'public/index.html'
    end

    #GET /app
    def app
        render 'app', layout: false
    end

    #POST /client/
    def new_session
        #check if provider_user id matches with the token, if not, request is not good
        if params[:provider_user] != nil && params[:provider_user] != get_user_id(params[:provider], params[:token]) then
            render :json => {:status => false }
        else
            user = nil
            if params[:provider] == 1 then
                user = User.find_by(provider: 1, provider_user: params[:provider_user])
            else
                user = User.find_or_initialize_by(provider: 0, provider_user: params[:provider_user])
            end

            if user then
                user.attributes = {
                    :mail => params[:email],
                    :provider => params[:provider],
                    :provider_user => params[:provider_user],
                    :last_login => DateTime.now,
                    :login_count => user.login_count + 1
                }

                if user.save then
                    session[:user_session] = {:id => user.id, :token => params[:token], :provider => params[:provider]}
                    render :json => {:status => true, :data => {
                        :config => user.config,
                        :additional_data => {
                            :demo_requests => user.demo_requests
                        }
                    }}
                else
                    render :json => {:status => false}
                end
            else
                render :json => {:status => false}
            end
        end
    end

    #POST client/save_config (string config)
    def save_config
        status = nil
        if session[:user_session] then
            user = User.find_by_id(session[:user_session][:id])
            user.config = params[:config]
            status= user.save
        else
            status = false
        end

        render :json => {:status => status}
    end

    #POST client/send_feedback
    def send_feedback
        status = false;
        feedback = Feedback.new;

        user_id = nil
        if session[:user_session].present?
            user_id = session[:user_session][:id]
        end

        feedback.attributes = {
            :user_id => user_id,
            :content => params[:content] }
        if feedback.save then
            status = true
        end
        render :json => {:status => status}
    end

    #POST client/calculate
    def calculate
        require 'uri'
        require 'httpi'
        require 'json'

        wa_credits = Setting.get_single_value('wa_credits').to_i

        if wa_credits < 0 then
            render :json => {:status => false, :data => {:message => "Please upgrade to premium"}}
        elsif wa_credits <= 1 then
            render :json => {:status => false, :data => {:message => "We are out of free credits... :)"}}
        else
            Setting.set_single_value 'wa_credits', wa_credits - 1
            request = HTTPI::Request.new
            request.url = 'http://api.wolframalpha.com/v2/query?input='+params[:wolfram] +'&appid=97HYUJ-9W3VAY9Y4Y'

            res = HTTPI.get(request)
            render :json => {:status => true, :data => res.raw_body.force_encoding("utf-8")}
        end
    end

    #GET client/updates
    def get_updates
        if session[:user_session] then
            updates = []
            img = nil
            db_updates = Update.includes(:user).where(:for_user => [session[:user_session][:id], nil])
            db_updates.each do |u|
                if u.for_user == nil then
                    img = ActionController::Base.helpers.image_path 'client/update-logo.png'
                else
                    img = u.user.img
                end
                updates.unshift({:title => u.title, :content => u.content,:img => img, :date => u.created_at})
            end
            render :json => {:status => true, :data => updates}
        else
            render :json => {:status => false}
        end
    end

    #POST client/log
    def log
        if session[:user_session] then
            user = User.find(session[:user_session][:id])
            if params[:event] == 'drive_request' then
                user.drive_requests_count += 1
                render :json => {:status => user.save}
            else
                render :json => {:status => false}
            end
        else
            render :json => {:status => false}
        end
    end

    #GET client/log_out
    def log_out
        session[:user_session] = nil
        render :json => {:status => true};
    end

    #GET client/user
    def delete_user
        status = false unless User.destroy(session[:user_session][:id])
        render :json => {:status => status}
    end

    #POST client/images/download
    def download_image
        require 'net/http'
        require "base64"
        data = Net::HTTP.get_response(URI(params[:url])).body
        render :json => {:status => true, :data => {:image_data => Base64.strict_encode64(data)}}
    end

    #POST client/images/upload
    def upload_image
        if params[:files].present?
            files_data = params[:files].map do |file|
                Base64.strict_encode64(file.read)
            end
            render json: {status: true, data: {files_data: files_data}}
        else
            render json: {status: false}
        end
    end

    def search_geogebra
        fetch_request = Geogebra::Request::Fetch.new params
        result = fetch_request.perform
        if result.present?
            items = result["responses"]["response"]["item"]
            render json: {status: true, data: items}
        else
            render json: {status: false}
        end
    end

    private

    def check_session
        redirect_to '/app' unless session[:user_session]
    end

    #this function is for checking if the user making new session request
    #is the actual user, not just somebody who knows their id
    def get_user_id(provider, token)
        require 'uri'
        require 'httpi'
        require 'json'

        res = nil
        data = nil

        request = HTTPI::Request.new

        if provider == 1 then
            #facebook needs access token in the url
            request.url = 'https://graph.facebook.com/me?fields=id&access_token=' + URI.escape(token)
        else
            #google needs header with access token
            request.url = 'https://www.googleapis.com/userinfo/v2/me'
            request.headers["Authorization"] = "Bearer " + token
        end

        #make the request and get response
        res = HTTPI.get(request)
        json = JSON.parse(res.raw_body)
        return json['id']
    end
end
