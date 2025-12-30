---
title: "Home Automation"
slug: "home-automation"
image: "home-automation-thumbnail"
category: "Python | C++ | MQTT | Networking | Linux | Bash"
galleryImages:
  - 
learnMoreLink: "https://github.com/eddydpan/fpga-sequencer/tree/main" //TODO: resolve this link
--- 


## Overview
I have been a bit obsessed about "smartifying" my living spaces. However, I've also been trying to stay more security-conscious. While the convenience of an Amazon Echo or Google Home seemed incredible, my pride kicked in thinking: "yeah, I could build this myself".  

I've enjoyed this project so much because of its immediate applications in my life. I started out using smart plugs and LEDs that I could communicate with over my network and had an exposed Python API. This was perfect for my first goal: having clap-controlled lights. 

I set up a Raspberry Pi to run some simple digital signal processing for two "clap-like" sounds which would send a command over the network to toggle the state of the lights. 

Eventually, I wanted to upgrade this project. Using ODROID XU4s, I broke my initial Raspberry Pi out into a distributed system and refactored my Python code to C++. With a distributed system, I enabled myself to have task-specific SBCs: audio, video, and embedded nodes. 