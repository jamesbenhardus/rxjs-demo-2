import { Component } from '@angular/core';
import {
  Observable,
  Subject,
  of,
  combineLatest,
  forkJoin,
  BehaviorSubject,
} from 'rxjs';
import { ApiService } from './api.service';
import { FormGroup, FormControl } from '@angular/forms';
import {
  switchMap,
  startWith,
  map,
  delay,
  mergeMap,
  concatMap,
  filter,
  take,
  takeUntil,
  takeWhile,
  skip,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  count = 0;
  countSubject$ = new Subject<number>();
  mapped$!: Observable<number>;
  merged$!: Observable<number>;
  switched$!: Observable<number>;
  concat$!: Observable<number>;

  switchSub!: number;

  aClicked = 0;
  bClicked = 0;

  subjectA$ = new Subject();
  subjectB$ = new Subject();

  combined$!: Observable<any>;
  forkJoined$!: Observable<any>;

  filterCount = 0;

  filterSubject$ = new BehaviorSubject<number>(0);

  filter$!: Observable<number>;
  take$!: Observable<number>;
  takeWhile$!: Observable<number>;
  takeUntil$!: Observable<number>;
  skip$!: Observable<any>;

  takeWhileStop$ = new Subject<void>();

  apiCall$!: Observable<any>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.makeApiCall().subscribe();
    this.mapped$ = this.countSubject$
      .asObservable()
      .pipe(map((count) => Math.pow(2, count)));

    this.merged$ = this.countSubject$.asObservable().pipe(
      startWith(0),
      mergeMap((count) => {
        if (count % 2 == 0) {
          return of(count).pipe(delay(2000));
        } else {
          return of(count).pipe(delay(1000));
        }
      })
    );

    this.switched$ = this.countSubject$.asObservable().pipe(
      switchMap((count) => {
        if (count % 2 == 0) {
          return of(count).pipe(delay(2000));
        } else if (count === 5) {
          return of(count);
        } else {
          return of(count).pipe(delay(1000));
        }
      })
    );

    this.switched$.subscribe((count) => {
      this.switchSub = count;
    });

    this.concat$ = this.countSubject$.asObservable().pipe(
      concatMap((count) => {
        if (count % 2 == 0) {
          return of(count).pipe(delay(2000));
        } else {
          return of(count).pipe(delay(1000));
        }
      })
    );

    // Combining
    const aDelayed = this.subjectA$.asObservable().pipe(delay(2000));
    const bDelayed = this.subjectB$.asObservable().pipe(delay(1000));

    this.combined$ = combineLatest([aDelayed, bDelayed]).pipe(
      map(([a, b]) => ({ a, b }))
    );
    this.forkJoined$ = forkJoin([aDelayed, bDelayed]).pipe(
      map(([a, b]) => ({ a, b }))
    );

    // Filtering
    this.filter$ = this.filterSubject$.pipe(filter((value) => value % 2 == 0));
    this.take$ = this.filterSubject$.pipe(take(5));
    this.takeWhile$ = this.filterSubject$.pipe(takeWhile((value) => value < 6));
    this.takeUntil$ = this.filterSubject$.pipe(takeUntil(this.takeWhileStop$));
    this.skip$ = this.filterSubject$.pipe(
      skip(3),
      map((count) => count.toString())
    );
  }

  emitA() {
    this.aClicked++;
    this.subjectA$.next(this.aClicked);
    if (this.aClicked == 4) {
      this.subjectA$.complete();
    }
  }

  emitB() {
    this.bClicked++;
    this.subjectB$.next(this.bClicked);
    if (this.bClicked == 3) {
      this.subjectB$.complete();
    }
  }

  increment() {
    this.count++;
    this.countSubject$.next(this.count);
  }

  reset() {
    this.count = 0;
    // this.countSubject$.next(0);
  }

  incrementFilter() {
    this.filterCount++;
    this.filterSubject$.next(this.filterCount);
  }

  resetFilter() {
    this.filterCount = 0;
  }
}
