#include <stdio.h>

#define IN  1                   /* inside a word */
#define OUT 0                   /* outside a word */

main(){
    int c, nl, nw, nc, state;   /* num chars, words, and lines */
    nc = nw = nl = 0;
    state = OUT;
    printf("Type something or press ^D to quit\n");
    printf("NOTE. ^C is different from ^D\n");
    while ((c = getchar()) != EOF){
        if (c == '\n'){
            nl++;
        }
        if (c == ' ' || c == '\n' || c == '\t'){
            state = OUT;
        } else if (state == OUT){
            state = IN;
            nw++;
        }
        nc++;
    }
    printf("%d %d %d\n", nc, nl, nw);
}
