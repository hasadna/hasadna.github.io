package main

import (
  "log"
  "fmt"
  "net/http"
  "github.com/gorilla/mux"
)

func main() {
    
    // Mux router
    r := mux.NewRouter()
    r.HandleFunc("/", IndexHandler)
    r.HandleFunc("/dest", DestHandler)
    r.HandleFunc("/bower", DestHandler)
    
    
    // Pass Mux as defualt router
    http.Handle("/",  r)
    
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal("ListenAndServe: ", err)
    } else {
      fmt.Println("Server listening on http://localhost:8080")
    }
}

func IndexHandler(w http.ResponseWriter, r *http.Request){
//    http.FileServer(http.Dir("../index.html"))
    http.ServeFile(w, r, "../index.html")
}

func DestHandler(w http.ResponseWriter, r *http.Request){
    http.ServeFile(w, r, ".." + r.URL.ToString() )
}