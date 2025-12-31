---
title: "FPGA Digital Sequencer"
slug: "digital-sequencer"
image: "digital-sequencer-thumbnail"
category: "SystemVerilog | C++ | UART | I2C | DSP | Qt"
galleryImages:
  - "digital-sequencer-thumbnail"
learnMoreLink: "https://github.com/eddydpan/fpga-sequencer/tree/main"
leftAnimation:
  shape: circle
  color: green
  count: 8
rightAnimation:
  shape: circle
  color: green
  count: 8
---
--- 

# FPGA Digital Sequencer
Updated: December 28, 2025

## Project Overview 

Our core objective is to develop a functional Digital Beat Sequencer implemented in SystemVerilog on the iceBlinkPico. Our MVP consists of three integrated subsystems: the Core Sequencer Logic, the Audio Output, and the Visual Output. For the core logic, we will use a 4x4 Keypad Matrix to program the memory addresses of a 16-step sequence, determining which beats trigger a sound. The audio output will be monophonic; a rotary encoder will set the tone by mapping user input to one of eight selectable pitches within a single octave (C4-C5). This tone is generated as a basic digital square wave and output directly to a buzzer, bypassing the need for a DAC. Finally, for visual output, we use a seven segment display to show the tone currently selected by the rotary encoder.

## GitHub Repo
Our GitHub repo contains our digital design modules in SystemVerilog, the Qt Visualizer GUI in C++, as well as much more documentation on our modules and design decisions.  

**Github Link:** [https://github.com/eddydpan/fpga-sequencer](https://github.com/eddydpan/fpga-sequencer) 

## Video Demonstration

[FPGA Sequencer: Creating Beats](https://youtube.com/shorts/dOwPXBnwGPw?feature=share)

[Tetris Theme Demo](https://youtube.com/shorts/HQIssS48aXo?si=sSymORCl6q5preDt)

## Reflections

Overall, this project was a blast to work on. At the time, I had a beginner-intermediate understanding of SystemVerilog, and this project absolutely helped to solidify architecting digital design. I was also able to use this project as a platform to learn Qt and C++. There were so many opportunities and directions for new learning opportunities with this project--with each feature yielding satisfaction and joy. Ultimately, we had a little more than 1 week to implement this project, and we took it as far as we could within that timeframe. With how time-constrained this project felt, I am more than happy with the results, and I am eager to continue working on this project in the near future. Hopefully I remember to update this website with the final product, but I have big dreams of building an ensemble of embedded music instruments to play in ~~symphony~~ cacophony.   

## Next Steps

Since this project was both fun and offered great learning opportunities, we’re looking to build on top of this project by:

1. Swapping out the 4x4 Keypin Matrix with the Adafruit NeoTrellis PCB  
  - It offers a more satisfying tactile experience  
  - Uses RGBs at each button to visualize tones as the sequence builds  
  - Uses the I2C protocol which we would need to implement in SystemVerilog  
2. Digital-to-Analog Converter  
  - Implementing a DAC would open the gates to a myriad of audio opportunities. We would gain access to sine waves, sawtooth waves, triangle waves, etc.   
  - An even further continuation of a DAC would be to implement Attack-Decay-Sustain-Release (ADSR) Envelopes  
3. Implement a UART RX module on the FPGA  
  - Send transmissions from the GUI Visualizer to the FPGA over UART to load “punch-ins” into memory  
4. Turn it into a product by soldering it to perfboard and encasing it within a 3D-printed shell.

Over the course of the next calendar year, we plan on implementing these features. 