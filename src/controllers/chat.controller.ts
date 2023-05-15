import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ApiResponseCode } from '../types/response';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_APIKEY,
  organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);

const file = readFileSync(
  resolve(__dirname, '../resources/about.txt')
).toString('utf8');

const getChatResponse = async (req: Request, res: Response) => {
  const { content } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful chat bot assistant responding to questions about Adrian using the following information:\n\n${file}`,
        },
        { role: 'user', content: content },
      ],
    });
    const response = completion.data.choices[0].message.content;
    res.status(ApiResponseCode.SUCCESS).send({ message: response });
  } catch (err) {
    res.sendStatus(ApiResponseCode.SERVER_ERROR);
  }
};

export { getChatResponse };
