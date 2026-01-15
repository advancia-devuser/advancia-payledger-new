export const noAITraining = (req: any, res: any, next: any) => {
  res.setHeader('X-Robots-Tag', 'noai, noimageai');
  res.setHeader('X-AI-Training', 'none');
  next();
};
