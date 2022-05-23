module Geogebra::Request
  class Base
    def perform
      response = send
      parse response
    end

    def send
      uri = URI(GEOGEBRA_API)
      request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
      request.body = params.to_json
      Net::HTTP.start(uri.hostname, uri.port) do |http|
        http.request(request)
      end
    end

    def parse response
      if response.present? && response.code == '200'
        begin
          JSON.parse response.body
        rescue StandardError
          nil
        end
      else
        nil
      end
    end

    def params
      {}
    end
  end

  class Fetch < Base

    DEFAULTS = { "limit" => 5, "page" => 1, "query" => ''}

    attr_reader :query, :limit, :page

    def initialize options
      options = DEFAULTS.merge options
      @query = options["query"]
      @limit = options["limit"]
      @page  = options["page"]
    end

    def params
      {
        "request" => {
          "-api" => "1.0.0",
          "task" => {
            "-type" => "fetch",
            "fields" => {
              "field" => [
                { "-name" => "url" },
                { "-name" => "id" },
                { "-name" => "title" },
                { "-name" => "author" },
                { "-name" => "thumbnail" }
              ]
            },
            "filters"  => {
              "field" => [
                { "-name" => "search", "#text" => query }
              ]
            },
            "order" => {
              "-by" => "timestamp",
              "-type" => "desc"
            },
            "limit" => limit_params
          }
        }
      }
    end

    def limit_params
      { "-num" => limit, "-page" => page }
    end
  end
end