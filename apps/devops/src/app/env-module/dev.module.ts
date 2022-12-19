import { devTools } from '@ngneat/elf-devtools';
import { environment } from '@environments';

if(!environment.production) {
  devTools();
}