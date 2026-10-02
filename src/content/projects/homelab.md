---
title: "Homelab"
slug: "homelab"
image: "homelab-thumbnail"
category: "Python | C++ | MQTT | Networking | Linux | Bash"
galleryImages:
  - 
learnMoreLink: "https://github.com/eddydpan/pancluster"
--- 


## Context
A major reason I wanted to become an engineer was to usher in technology from the future. My experience at Olin enabled me to learn about the role of technology, and how I can better affect the world around me outside of the context of engineering. I've had countless opportunities to work on meaningful projects with real stakeholders and external impact. I've adopted the mindset of an engineer; and it feels unfortunate when a less-technical solution clearly beats out the technical-one in impact. These situations leave me with a hint regret that's quickly overshadowed by moral satisfaction. 

In search for other outlets to apply my technicall skills, I tried for practical applications close to home--and I mean close-to-home. I've been a bit obsessed about "smartifying" the spaces I find myself in each day. Luckily, there are a variety of convenient solutions fit for the biggest ecosystems: the Amazon Echo, Google Nest, and Apple HomePod. I can't deny that they're incredible pieces of technology with seemeless integration and setup. But I know that in our modern age, convenience is a trap. Convenience comes with hidden fees; convenience risks your privacy; convenience takes away your agency; convenience leads to complacency. With my background, my pride kicked in-- "Yeah, I could build this myself".  

--- 

I've enjoyed this project so much because of its immediate applications in my life. I started out using smart plugs and LEDs that I could communicate with over my network and had an exposed Python API. This was perfect for my first goal: having clap-controlled lights. 

I set up a Raspberry Pi to run some simple digital signal processing for two "clap-like" sounds which would send a command over the network to toggle the state of the lights. 

Eventually, I wanted to upgrade this project. Using ODROID XU4s, I broke my initial Raspberry Pi out into a distributed system and refactored my Python code to C++. With a distributed system, I enabled myself to have task-specific SBCs: audio, video, and embedded nodes. 

## Github Repository
### Iteration 3 (CURRENT)

### Iteration 2
This repo contains the source code for the distributed systems home automation project.  
**Github Link:** [https://github.com/eddydpan/pancluster](https://github.com/eddydpan/pancluster)

### Iteration 1