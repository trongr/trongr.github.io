#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

bool throwAPairOfSixes() {
  int r = rand() % 6 + 1;
  int s = rand() % 6 + 1;
  if (r == 6 && s == 6) {
    return true;
  } else {
    return false;
  }
}

bool throwAPairOfSixesInNThrows(int n) {
  for (int i = 0; i < n; i++) {
    if (throwAPairOfSixes()) {
      return true;
    }
  }
  return false;
}

int main() {
  srand(time(NULL)); // should only be called once

  int NUM_RUNS = 100000;
  int NUM_THROWS = 24;
  int win_count = 0;

  for (int i = 0; i < NUM_RUNS; i++) {
    if (throwAPairOfSixesInNThrows(NUM_THROWS)) {
      win_count++;
    }
  }
  printf("Win count: %d. Num runs: %d\n", win_count, NUM_RUNS);

  return 0;
}
