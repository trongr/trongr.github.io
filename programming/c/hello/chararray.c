#include <stdio.h>

#define MAXLINELENGTH 100

int getline(char line[], int maxlinelength);
void copy(char from[], char to[]);
void printLongestLine();

int main(){
    printLongestLine();
    return 0;
}

/* Reads user input line by line and prints the longest line */
void printLongestLine(){
    int len;
    int max = 0;
    char line[MAXLINELENGTH];
    char longest[MAXLINELENGTH];
    printf("Type some lines. Press c-d to quit\n");
    while ((len = getline(line, MAXLINELENGTH)) > 0){
        if (len > max){
            max = len;
            copy(line, longest);
        }
    }
    if (max > 0){
        printf("The longest line was: %d %s\n", max, longest);
    }
}

/* Reads a line into line, returns length */
int getline(char line[], int maxlinelength){
    int c, i;
    // Book says this is -1, but I think it should be -2, cause we're
    // appending \n and null terminator \0 to the end. Otherwise we'll
    // assign '\0' outside the array, that's not good.
    for (i = 0; i < maxlinelength - 2
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

void copy(char from[], char to[]){
    int i = 0;
    while ((to[i] = from[i]) != '\0'){
        i++;
    }
}
