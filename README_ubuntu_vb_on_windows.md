Setup for Ubuntu VB on Windows
===============================================
This document explains how to set up the environment to run this webapp on an Ubuntu virtual box on Windows.

Versions used for writting this document
----------------------------------------
* Windows 10
* [Vagrant](https://www.vagrantup.com/) 1.8.1
* [VirtualBox](https://www.virtualbox.org/) 5.0.14
* Ubuntu 14.04 64-bit version (Trusty Tahr) (Note: It can be installed through Vagrant box [ubuntu/trusty64](https://atlas.hashicorp.com/ubuntu/boxes/trusty64).)

Vagrantfile
-----------
Copy and paste the following text into a file named "Vagrantfile" in the folder you want to use to share between Windows and Ubuntu. These settings will enable port forwarding, a shared folder (named "ai2-dev"), and creation of symlinks. The memory size is set to 2GB.
```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    # All Vagrant configuration is done here. The most common configuration
    # options are documented and commented below. For a complete reference,
    # please see the online documentation at vagrantup.com.

    # Every Vagrant virtual environment requires a box to build off of.
    config.vm.box = "ubuntu/trusty64"
    
    # Create a forwarded port mapping which allows access to a specific port
    # within the machine from a port on the host machine. In the example below,
    # accessing "localhost:8080" will access port 80 on the guest machine.
    config.vm.network :forwarded_port, guest: 8083, host: 8083

    # If true, then any SSH connections made will enable agent forwarding.
    # Default value: false
    config.ssh.forward_agent = true

    # Share an additional folder to the guest VM. The first argument is
    # the path on the host to the actual folder. The second argument is
    # the path on the guest to mount the folder. And the optional third
    # argument is a set of non-required options.
    config.vm.synced_folder ".", "/home/vagrant/ai2-dev/"
 
    # Enable symlinks in vagrant shared folder, https://github.com/mmzeeman/vagrant-zotonic/blob/master/Vagrantfile
    # Different version of vagrant uses different shared name so we need them all
    config.vm.provider "virtualbox" do |v|
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant-root", "1"]
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
    end
    
    config.vm.provider "virtualbox" do |v|
      v.memory = 2048
    end
end

```

Please note that the part for symlinks is necessary. Virtualbox [disabled symlinks in the shared folder since version 4.1.8](https://www.virtualbox.org/ticket/10085#comment:12) for security reasons. If we don't set this part, there will be issues when install nodejs packages. In addition, we will need to execute VB as admin. See this [link](http://www.ahtik.com/blog/fixing-your-virtualbox-shared-folder-symlink-error/) for more details.

Getting started
-----------
1. Install Virtualbox and Vagrant

2. Download the [AI2 template](https://github.com/allenai/templates/archive/master.zip). Unzip it and copy the webapp folder to the folder where you put Vagrantfile in.

3. [Open the command line (cmd) **as administrator**](https://technet.microsoft.com/en-us/library/cc947813(v=ws.10).aspx) and cd to the folder containing Vagrantfile. **It is necessary to run it as admin** so that we can create symlinks in shared folders. You can also make this part of the option in the right click menu. You can find [this link](http://www.sevenforums.com/tutorials/47415-open-command-window-here-administrator.html) for more details.

4. Type ``vagrant up`` to bring up the virtual machine.

5. Once the machine is on, use [putty](http://www.putty.org/) (or other ssh software) to ssh to ``localhost`` with port ``2222``

6. The default login credential of both username and password are ``vagrant``.

7. Install required dependencies specified in the [AI2 Getting Started](https://github.com/allenai/wiki/wiki/Getting-Started) and [the README.md of wepapp template](https://github.com/allenai/templates/blob/master/webapp/README.md) by the following commands: 
  ```bash
  # Installing sbt
  echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 642AC823
  sudo apt-get update
  sudo apt-get install sbt
  
  # Installing scala; make sure you get the lastest version's url from the Scala website
  sudo wget http://downloads.lightbend.com/scala/2.11.8/scala-2.11.8.deb
  sudo dpkg -i scala-2.11.8.deb
  sudo apt-get update
  sudo apt-get install scala
  
  # Installing openjdk-8
  sudo add-apt-repository ppa:openjdk-r/ppa
  sudo apt-get update
  sudo apt-get install openjdk-8-jdk
  
  # Ensure the correct version (/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java) is selected
  sudo update-alternatives --config java
  ```
8. Install Node.js and related package. 
  ```bash
  # Installing Node.js. Note that the package name in Ubuntu is nodejs, not node. 
  # That's why we need the second line to make node cmd work
  sudo apt-get install nodejs
  sudo ln -s /usr/bin/nodejs /usr/bin/node
  
  # Installing NPM, the package manager for Node.js
  sudo apt-get install npm
  
  # Updating both NPM the lastest version
  sudo npm install -g npm
  
  # Updating NodeJS to the lasted version. Ref: http://tecadmin.net/upgrade-nodejs-via-npm/
  # v6.2.2 is the lastest version when the tutorial was written. Make sure to put the correct one.
  sudo npm cache clean -f 
  sudo npm install -g n 
  sudo n stable 
  sudo ln -sf /usr/local/n/versions/node/6.2.2/bin/node /usr/bin/node
  
  # Installing Gulp.js. This is the only package one need to install outside sbt
  sudo npm install -g gulp-cli
  ```
  
9. Set up Git. Then initialize the folder as a repo and make the first commit. 
  ```bash
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
  git init
  git add -a .
  git commit -m "init"
  ```
  This step is necessary; otherwise the following errors will appear when running ``sbt reStart``.
  ```sbt
  [trace] Stack trace suppressed: run last *:gitCommitDate for the full output.
  [trace] Stack trace suppressed: run last *:gitSha1 for the full output.
  [error] (*:gitCommitDate) Nonzero exit value: 128
  [error] (*:gitSha1) Nonzero exit value: 128
  ```
  
10. Start sbt. The first time will take longer.
  ```bash
  sbt
  ```

11. Start the server
  ```bash
  reStart
  ```
  
12. If no error, the server should be running on ``http://localhost:8083``. It can be reachable on the Windows side.


To make it simpler
====================
The above environment setups have been saved into a VB box for vagrant. Simply use the following Vagrant file and you can skip step 7 and step 8 of the above instructions.

The alternative Vagrantfile
-----------------------------
```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    # All Vagrant configuration is done here. The most common configuration
    # options are documented and commented below. For a complete reference,
    # please see the online documentation at vagrantup.com.

    # Every Vagrant virtual environment requires a box to build off of.
    config.vm.box = "nanchenchen/ai2-dev-ubuntu"
    
    # Create a forwarded port mapping which allows access to a specific port
    # within the machine from a port on the host machine. In the example below,
    # accessing "localhost:8080" will access port 80 on the guest machine.
    config.vm.network :forwarded_port, guest: 8083, host: 8083

    # If true, then any SSH connections made will enable agent forwarding.
    # Default value: false
    config.ssh.forward_agent = true

    # Share an additional folder to the guest VM. The first argument is
    # the path on the host to the actual folder. The second argument is
    # the path on the guest to mount the folder. And the optional third
    # argument is a set of non-required options.
    config.vm.synced_folder ".", "/home/vagrant/ai2-dev/"
 
    # Enable symlinks in vagrant shared folder, https://github.com/mmzeeman/vagrant-zotonic/blob/master/Vagrantfile
    # Different version of vagrant uses different shared name so we need them all
    config.vm.provider "virtualbox" do |v|
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant-root", "1"]
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]         
    end
    
    config.vm.provider "virtualbox" do |v|
      v.memory = 2048
    end
end
```

Note that the webapp folder is not included in the box so you need to extract that from the template zip. 
