---
title: "RISC-V VM and Processor"
slug: "risc-v"
image: "harris-harris-multicycle-unpipelined-processor-diag"
category: "C | CMake | RISC-V | SystemVerilog | ASM"
galleryImages:
  - mp4-processor-sim
learnMoreLink: "https://github.com/olincollege/pVMpkin"
--- 

## Overview
In order to build my understanding of computer architecture and engineering, I got my hands dirty with the [RISC-V architecture](https://en.wikipedia.org/wiki/RISC-V). I implemented both a RISC-based LC-3 virtual machine in C and the RV32I instruction set for an Unpipelined Multicycle RISC-V Processor in SystemVerilog. 

### GitHub Links
LC-3 Virtual Machine: [https://github.com/olincollege/pVMpkin](https://github.com/olincollege/pVMpkin)
Unpipelined Multicycle RV32I Processor: [https://github.com/darianjimenez/MP4/tree/main](https://github.com/darianjimenez/MP4/tree/main)

### LC-3 Virtual Machine
See [this slideshow](https://docs.google.com/presentation/d/12DWFksfCx5f3zhMVkU8ODTlY10oCDZahaejDrJKTmhU/preview?usp=sharing) for more detailed documentation on how we implemented the virtual machine to run ASM and visualized the memory with an SDL3 memory map. 

### RISC-V Processor Documentation 
```pdf
/docs/mp4-writeup.pdf
```