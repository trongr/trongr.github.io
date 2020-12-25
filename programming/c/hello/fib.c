#include <stdio.h>

#define MAX_N 32

main(){
    int n = 0;
    int f0 = 0;
    int f1 = 1;
    int tmp;
    while (n < MAX_N){
        printf("%3d %10d\n", n, f0);
        tmp = f1;
        f1 = f0 + f1;
        f0 = tmp;
        n++;
    }
}
