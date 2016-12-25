#include <stdio.h>
#include <stdbool.h>
#include <assert.h>

void chartoshort(){
    char c = 'A';
    short s = c;
    printf("c: %c\n", c);
    printf("s: %d\n", s);
}

void shorttochar(){
    short s = 65;
    char c = s;
    printf("c: %c\n", c);
    printf("s: %d\n", s);
}

void inttoshort(){
    int a = 8388608;
    short b = a;
    printf("int: %d\n", a);
    printf("sho: %d\n", b);
}

int main(){
    inttoshort();
    return 0;
}
