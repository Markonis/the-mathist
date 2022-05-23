Themathist::Application.routes.draw do

  #the app route
  get '/app' => 'client#app'

  #admin
  namespace :admin do
    get '/' => 'pages#index'
    resources :feedbacks
    resources :updates
    resources :users
    resources :settings
  end

  #root
  root :to => 'client#index'

  #client routes
  post   'client/new_session'     => 'client#new_session'
  post   'client/save_config'     => 'client#save_config'
  get    'client/log_out'         => 'client#log_out'
  get    'client/updates'         => 'client#get_updates'
  post   'client/send_feedback'   => 'client#send_feedback'
  post   'client/log'             => 'client#log'
  post   'client/calculate'       => 'client#calculate'
  post   'client/images/download' => 'client#download_image'
  post   'client/images/upload'   => 'client#upload_image'
  post   'client/geogebra/search' => 'client#search_geogebra'
  get    'client/images/:hash'    => 'client#load_image'
  delete 'client/user'            => 'client#delete_user'

  get 'open' => 'client#open_drive_file'
end
