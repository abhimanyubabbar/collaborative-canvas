SERVICE ='collaborative-canvas'

REVISION = `git describe --always --dirty='-dirty'`.strip
BRANCH = `git symbolic-ref --short HEAD`.strip

USER = "babbarshaer"
IMAGE = "#{SERVICE}:#{BRANCH}"
IMAGE_WITH_REVISION = "#{IMAGE}-#{REVISION}"

task :build do
  sh "docker build -t #{IMAGE} -t #{IMAGE_WITH_REVISION} ."
  puts "Build is located at: #{IMAGE_WITH_REVISION}"
end

task :run => [:build] do
  sh "docker run -p 8080:8080 #{IMAGE_WITH_REVISION}"
end
