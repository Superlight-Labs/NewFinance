require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "rn-crypto-mpc"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/lauhon/WalletPOC.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,mm}", "cpp/**/*.{cpp,h}"


  s.dependency "React-Core"
  s.dependency "OpenSSL-Universal"

  s.pod_target_xcconfig = {
    'OTHER_CFLAGS[sdk=iphonesimulator*][arch=x86_64]' => '-maes -mpclmul'
  }

end
