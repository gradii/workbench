import { Component, OnInit } from '@angular/core';
import { data } from '../data';

@Component({
  selector   : 'devops-tools-test-generate-use-ast',
  templateUrl: './test-generate-use-ast.component.html',
  styleUrls  : ['./test-generate-use-ast.component.scss']
})
export class TestGenerateUseAstComponent implements OnInit {
  title = 'test-workbench';

  pageData: any = data;

  constructor() {
  }

  ngOnInit(): void {
  }
}
