export interface SessionTranscript {
  id: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
}
export function createSessionTranscript(id: string): SessionTranscript {
  return { id, messages: [], createdAt: new Date(), updatedAt: new Date() };
}
export function addMessage(transcript: SessionTranscript, message: any): void {
  transcript.messages.push(message);
  transcript.updatedAt = new Date();
}
