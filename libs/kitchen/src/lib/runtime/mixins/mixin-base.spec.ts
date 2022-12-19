export class CodeGenVisitorTest {

  ident            = 0;
  output: string[] = [];


  incIdent(level: number = 1) {
    this.ident += level;
  }

  decIdent(level: number = 1) {
    this.ident -= level;
  }

  write(content: string) {
    this.output.push(content);
  }

  writeLn(content: string = '') {
    this.output.push(`${content}\n`);
  }

  identWrite(content: string) {
    this.output.push(`${'  '.repeat(this.ident)}${content}`);
  }

  identWriteLn(content: string) {
    this.output.push(`${'  '.repeat(this.ident)}${content}\n`);
  }

  incWrite(content: string, ident?: number) {
    this.incIdent(ident);
    this.identWrite(content);
  }

  decWrite(content: string, ident?: number) {
    this.decIdent(ident);
    this.identWrite(content);
  }

  writeDec(content: string, ident?: number) {
    this.identWrite(content);
    this.decIdent(ident);
  }

  getOutput() {
    return this.output.join('');
  }

  flush() {
    const output = this.getOutput();
    this.output  = [];
    return output;
  }
}