---
title: "Control-Oriented Universal Chassis Hub (COUCH)"
slug: "couch"
image: "couch-thumbnail"
category: "C | ESP32 | ESP-IDF | FreeRTOS | Bluetooth | DAC | Motor Control"
galleryImages:
  - "couch-final-photoshoot"
  - "couch-pre-drive"
  - "couch-debugging-candid"
learnMoreLink: https://github.com/eddydpan/COUCH"
--- 

## Hype Video
```youtube
https://youtu.be/RcAKfHjtkew
```
props to Cooper for making the hype video!

## GitHub Link:
[https://github.com/eddydpan/COUCH](https://github.com/eddydpan/COUCH)
## Description
For a passion project during our third year, my friends--Cooper and Tane--and I decided to take up an engineering project together: a remote-controlled motorized rig. Cooper led mechanical, Tane led electrical, and I led software. By no means was this a cheap project; in the end, we spent right up against $450 for the cheapest components that would have this rig in a position to drive.  

This project was a great opportunity for me to apply what I've learned within Software Engineering and move lower into embedded programming. I was working with an ESP32 with the ESP-IDF development environment. After the initial learning curve, I used the [Bluepad32](https://github.com/ricardoquesada/bluepad32) library built off [BTStack](https://github.com/bluekitchen/btstack) to connect the PS4 Controller to the ESP32. 

Afterwards, I used two DAC pins from the ESP32 to drive current to the throttle pins on our motor controller to control the speed. After mapping the DAC pins' voltage to the PS4 Controller's left and right joystick, we had open-loop control. 

## Reflections
We were new to building a mobile base, and there were many ideas we failed to consider earlier for this project. 
Additionally, We ran into challenges of budgeting, as a project of this size ran us right up against our allotted Passionate Pursuit budget. Our project was tightly constrained by cost--altering how we spec'd out our components and resulting in us going with the cheapest options. 

In retrospect, we've identified many aspects of the project we would've changed had we done it again: (1) the motors and ESCs were from E-Bike kits and were the cheapest we could find, and much of our time was sunk into integrating them; (2) we would've organized our timeline to enable mechanical testing post-integration early on instead of going into our "final demo" mechanically untested; and (3) we would explore robust ways to connect the motor to the wheel axel. 

## Visibility
Ultimately, at the _Robots of Olin Exhibition_, we presented our rig to the larger Olin community explaining our design process, milestones, and reflections.