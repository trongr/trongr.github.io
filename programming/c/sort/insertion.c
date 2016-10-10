#include <stdio.h>
#include <stdbool.h>
#include <assert.h>

bool is_sorted(int a[], size_t n){
    for (size_t i = 0; i < n - 1; i++){
        if (a[i] > a[i + 1]){
            return false;
        }
    }
    return true;
}

void insertion(int a[], size_t n){
    for (size_t i = 1; i < n; i++){
        int key = a[i];
        size_t j = i;
        while (0 < j && key < a[j - 1]){
            a[j] = a[j - 1];
            j--;
        }
        a[j] = key;
    }
}

int main(){
    size_t n = 100;
    int a[n];

    printf("Unsorted array:\n");
    for (size_t i = 0; i < n; i++){
        printf("%d ", a[i]);
    }

    insertion(a, n);

    assert(is_sorted(a, n));

    printf("\nSorted array:\n");
    for (size_t i = 0; i < n; i++){
        printf("%d ", a[i]);
    }

    return 0;
}
