---
title: "RISC-V VM and Processor"
slug: "risc-v"
image: "harris-harris-multicycle-unpipelined-processor-diag"
category: "C | CMake | RISC-V | SystemVerilog | ASM | SDL3"
galleryImages:
  - mp4-processor-sim
learnMoreLink: "https://github.com/olincollege/pVMpkin"
leftAnimation:
  shape: circle
  color: blue
  count: 8
rightAnimation:
  shape: circle
  color: blue
  count: 8
summary: "An LC-3 virtual machine in C and an RV32I multicycle processor in SystemVerilog, built from scratch with only the Harris and Harris textbook."
repo:
  - label: "LC-3 VM code"
    url: "https://github.com/olincollege/pVMpkin"
  - label: "RV32I processor code"
    url: "https://github.com/darianjimenez/MP4"
--- 

## Overview
As a challenge in building my understanding of computer architecture, I got my hands dirty with the [RISC-V architecture](https://en.wikipedia.org/wiki/RISC-V). I implemented both a RISC-based LC-3 virtual machine in C and the RV32I instruction set for an Unpipelined Multicycle RISC-V Processor in SystemVerilog from scratch. I didn't use any website tutorials, reference code, or AI tools. It was just us and Harris and Harris' *Digital Design and Computer Architecture* textbook. 


### LC-3 Virtual Machine - pVMpkin
See [this slideshow](https://docs.google.com/presentation/d/12DWFksfCx5f3zhMVkU8ODTlY10oCDZahaejDrJKTmhU/preview?usp=sharing) for more detailed documentation on how we implemented the virtual machine to run ASM and visualized the memory with an SDL3 memory map. 

### RISC-V Processor 
See this report on the architecture and design decisions for the RV32I instruction set RISC-V Processor below:

```pdf
/docs/mp4-writeup.pdf
```