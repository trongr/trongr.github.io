#include <stdio.h>

#define MAXLINELENGTH 100

int max = 0;
char line[MAXLINELENGTH];
char longest[MAXLINELENGTH];

int getline(void);
void copy(void);
void printLongestLine(void);

int main(){
    printLongestLine();
    return 0;
}

/* Reads user input line by line and prints the longest line */
void printLongestLine(void){
    extern int max;
    extern char longest[];

    int len;

    printf("Type some lines. Press c-d to quit\n");
    while ((len = getline()) > 0){
        if (len > max){
            max = len;
            copy();
        }
    }
    if (max > 0){
        printf("The longest line was: %d %s\n", max, longest);
    }
}

/* Reads a line into line, returns length */
int getline(void){
    extern char line[];
    int c, i;
    // Book says this is -1, but I think it should be -2, cause we're
    // appending \n and null terminator \0 to the end. Otherwise we'll
    // assign '\0' outside the array, that's not good.
    for (i = 0; i < MAXLINELENGTH - 2
             && (c = getchar()) != EOF && c != '\n'; i++){
        line[i] = c;
    }
    if (c == '\n'){
        line[i] = c;
        i++;
    }
    line[i] = '\0';
    return i;
}

void copy(void){
    extern char line[];
    extern char longest[];
    int i = 0;
    while ((longest[i] = line[i]) != '\0'){
        i++;
    }
}
