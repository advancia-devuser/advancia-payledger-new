// Wake Time Programming API Routes
// Implements: Programmed wake time and programming source analysis
// Reference Number: 123456789-HELOC-CREATOR

import { Router, Request, Response } from 'express';
import WakeTimeProgrammingService from '../services/WakeTimeProgrammingService';

const router = Router();

// START WAKE TIME PROGRAMMING
router.post('/start', async (req: Request, res: Response) => {
  try {
    await WakeTimeProgrammingService.startWakeTimeProgramming();
    res.json({
      success: true,
      message: 'Wake Time Programming activated',
      philosophy: 'Programmed wake time and programming source analysis',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// STOP WAKE TIME PROGRAMMING
router.post('/stop', async (req: Request, res: Response) => {
  try {
    await WakeTimeProgrammingService.stopWakeTimeProgramming();
    res.json({
      success: true,
      message: 'Wake Time Programming deactivated',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// GET WAKE TIME PROGRAMS
router.get('/programs', async (req: Request, res: Response) => {
  try {
    const programs = WakeTimeProgrammingService.getWakeTimePrograms();
    res.json({
      success: true,
      data: programs,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// GET PROGRAMMING DEVIATIONS
router.get('/deviations', async (req: Request, res: Response) => {
  try {
    const deviations = WakeTimeProgrammingService.getProgrammingDeviations();
    res.json({
      success: true,
      data: deviations,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// CREATE WAKE TIME PROGRAM
router.post('/program', async (req: Request, res: Response) => {
  try {
    const { userId, programmedWakeTime, programmingSource, programmingStrength } = req.body;
    res.json({
      success: true,
      message: `Wake time program created for user: ${userId}`,
      wakeTime: programmedWakeTime,
      source: programmingSource,
      strength: programmingStrength,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// MONITOR AWARENESS LEVEL
router.post('/awareness/monitor', async (req: Request, res: Response) => {
  try {
    const { programId, awarenessThreshold } = req.body;
    res.json({
      success: true,
      message: `Awareness monitoring initiated: ${programId}`,
      threshold: awarenessThreshold,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// TRACK OVERRIDE ATTEMPTS
router.post('/override/track', async (req: Request, res: Response) => {
  try {
    const { programId, overrideType, successRate } = req.body;
    res.json({
      success: true,
      message: `Override tracking initiated: ${programId}`,
      type: overrideType,
      success: successRate,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

export default router;
