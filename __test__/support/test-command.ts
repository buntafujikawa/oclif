import { Command } from '@oclif/core';

export const testCommand = async (
  klass: typeof Command,
  argv: string[] = []
): Promise<{ stdout: string[] }> => {
  const result: string[] = []

  const originalWrite = process.stdout.write

  const writeMock = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation((val, encoding, cb): boolean => {
      result.push(val as string)

      if (process.env.TEST_OUTPUT) {
        originalWrite(val, encoding, cb)
      } else if (cb) {
        cb()
      }

      return true
    })

  await klass.run(argv)

  writeMock.mockRestore()

  return {
    stdout: result,
  }
}
