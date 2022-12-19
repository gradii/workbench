import { dest, src, task } from 'gulp';

task('convert chai to jest', () => {
  src('libs/fedaco/mariadb-driver/test').pipe(
    dest('')
  )
});
