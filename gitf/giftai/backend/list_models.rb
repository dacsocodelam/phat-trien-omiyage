require 'net/http'
require 'json'
require 'uri'

# Load API Key from .env manually
api_key = nil
if File.exist?('.env')
  File.foreach('.env') do |line|
    if line =~ /^GEMINI_API_KEY=(.*)$/
      api_key = $1.strip
    end
  end
end

if api_key.nil? || api_key.empty?
  puts "Error: GEMINI_API_KEY not found in .env"
  exit
end

uri = URI("https://generativelanguage.googleapis.com/v1beta/models?key=#{api_key}")
response = Net::HTTP.get(uri)
data = JSON.parse(response)

if data['models']
  File.open('models.txt', 'w') do |f|
    data['models'].each do |model|
      if model['name'].downcase.include?('gemini')
        f.puts model['name']
      end
    end
  end
  puts "Models written to models.txt"
else
  puts "Error fetching models: #{response}"
end
