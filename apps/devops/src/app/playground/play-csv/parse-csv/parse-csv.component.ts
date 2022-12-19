import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';

@Component({
  selector   : 'devops-tools-parse-csv',
  templateUrl: './parse-csv.component.html',
  styleUrls  : ['./parse-csv.component.scss']
})
export class ParseCsvComponent implements OnInit {
  charset = 'GBK';

  config: string = `{
        comment: '#',
        header: true,
        delimiter: '\\t',
        skipEmptyLines: true
      }
  `;
  rst: any;
  fileModel: any;

  constructor() {
  }

  onParse(file, charset) {

    const reader = new FileReader();
    reader.readAsText(file, charset);
    reader.onload = (e) => {
      // urlData就是对应的文件内容
      const data = reader.result;

      let func = `return ${(this.config)};`;
      console.log(func);

      const conf = (new Function(func)).apply(this);
      console.log(conf);

      // @ts-ignore
      const rst = Papa.parse(data, conf);

      this.rst = rst;

      console.log(rst);

      // console.log(data);
    };

    // const url = reader.readAsDataURL(file);
    // console.log(url);
  }

  ngOnInit(): void {

  }

}
