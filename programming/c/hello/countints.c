#include <stdio.h>

int main(){
    int c, numWhitespace, numOther;
    int digitCounts[10];

    numWhitespace = numOther = 0;
    for (int i = 0; i < 10; i++){
        digitCounts[i] = 0;
    }

    printf("Type something or press ^D to quit\n");
    while ((c = getchar()) != EOF){
        if ('0' <= c && c <= '9'){
            digitCounts[c - '0']++;
        } else if (c == ' ' || c == '\n' || c == '\t'){
            numWhitespace++;
        } else {
            numOther++;
        }
    }
    printf("Digit counts:");
    for (int i = 0; i < 10; i++){
        printf(" %d", digitCounts[i]);
    }
    printf(", White spaces: %d, Other: %d\n", numWhitespace, numOther);

    return 0;
}
