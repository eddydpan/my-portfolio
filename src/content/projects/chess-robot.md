---
title: "BettaFish Chess Robot"
slug: "chess-robot"
image: "chess-thumbnail"
category: "Python | Path-Planning | Algorithms | Behavioral Robotics | Robot Arm"
galleryImages:
  - "chess-bot-action"
  - "chess-bot-sim"
  - "chess-grid-segmentation"
learnMoreLink: "https://eddydpan.github.io/chess_bot/"
leftAnimation:
  shape: square
  color: yellow
  count: 8
rightAnimation:
  shape: square
  color: yellow
  count: 8
---
## Github Repository
This repo contains a *clean history* of the project's development and source code for the chess robot logic and chess algorithm submodule.  

**Github Link:** [https://github.com/eddydpan/robot-chess-player](https://github.com/eddydpan/robot-chess-player)  

## Overview
During my sophomore Fall semester, I wrote my own chess algorithm in Python and implemented it on a robot arm so that I could play against it on a physical board. The chess algorithm uses [Piece-Square Tables](https://www.chessprogramming.org/Piece-Square_Tables) and [Minimax decision theory](https://en.wikipedia.org/wiki/Minimax) to evaluate the position and decide what move to play next. When testing this algorithm, it was able to beat chess bots up to 1800 ELO on [chess.com](chess.com), placing it in the 87th percentile of all online chess players. The robot arm uses inverse kinematics (IK) to calculate the joint angles of the 6 Degrees of Freedom (DOF) that the WidowX-250 has for any given target orientation in 3D space. With path-planning coupled with computer vision for move detection and recognition, we created [subroutines](https://www.digitalmzx.com/wiki/Subroutines) for each aspect of moving chess pieces that we take for granted: pick-and-place, captures, castling, and promotion. These subroutines come together within a finite state machine (FSM) to play a full game end-to-end against an opponent in the real-world.

## Documentation  
For further detail on the source code and overall project, see the following links. 

Website: [https://eddydpan.github.io/chess_bot/](https://eddydpan.github.io/chess_bot/)
Chess Engine Slideshow: [https://docs.google.com/presentation/d/1MeJLZUuVAlfuHdSQKM-r1YKdVrs1EY_WKdDAAZQdqas/preview?usp=sharing](https://docs.google.com/presentation/d/1MeJLZUuVAlfuHdSQKM-r1YKdVrs1EY_WKdDAAZQdqas/preview?usp=sharing)