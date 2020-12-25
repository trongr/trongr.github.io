#include <stdio.h>

int pow(int base, int exp);

/* exp must be int >= 0 */
int pow(int base, int exp){
    int n = 1;
    for (int i = 0; i < exp; i++){
        n = n * base;
    }
    return n;
}

int main(){
    for (int i = 0; i < 10; i++){
        printf("2^%d == %d\n", i, pow(2, i));
    }

    return 0;
}
