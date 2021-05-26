source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.6'
gem 'rails', '~> 6.1', '>= 6.1.3.2'

gem 'pg', '~> 1.1', '>= 1.1.4'
gem 'puma', '~> 5.3', '>= 5.3.1'
gem 'puma-daemon', '~> 0.1.2', require: false

gem 'awesome_print', '~> 1.8'
gem 'bootsnap', '>= 1.4.2', require: false
gem 'font-awesome-rails', '~> 4.7', '>= 4.7.0.2'
gem 'jquery-rails', '~> 4.4'
gem 'leaflet-rails', '~> 1.7'
gem 'terser', '~> 1.1', '>= 1.1.3'


group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw]

  gem 'factory_bot_rails', '~> 5.1', '>= 5.1.1'
  gem 'faker', '~> 2.10', '>= 2.10.1'
  gem 'rails-controller-testing'
  gem 'rspec-rails', '~> 4.0.1'
  gem 'shoulda-matchers', '~> 4.2'
end

group :development do
  gem 'annotate', '~> 3.0', '>= 3.0.3'

  gem 'better_errors', '~> 2.5', '>= 2.5.1'
  gem 'binding_of_caller', '~> 0.8.0'
  gem 'brakeman', '~> 5.0', '>= 5.0.1'
  gem 'bundler-audit', '~> 0.8.0'

  gem 'listen', '>= 3.0.5', '< 3.2'

  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
