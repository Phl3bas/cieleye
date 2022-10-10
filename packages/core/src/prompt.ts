import type { Answers } from 'inquirer'
import type { Prompt } from './types'

export function definePrompt<P extends Answers>(questions: Prompt<P>): Prompt<P> {
  return questions
}
