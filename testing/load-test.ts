const connections = 1

const attempts = 100

const avgList: number[] = []
const timeList: number[] = []

async function loadTest() {
    const start = Date.now()
    const resp = await fetch("http://127.0.0.1:3000/app/laboratories", {
        headers: {
            coockie: `Access-Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTc1MDMxNjI4My44Njd9.2b9Pj-U6KZblA09R-sJd_ESBwn1qeb3GtssoLjjmt7A; Max-Age=3600000; Path=/; HttpOnly`,        
        }
    })

    const time = (Date.now()-start) / 1000 // in seconds

    timeList.push(time)
    console.log(time)
}

async function main() {
    for (let i=1; i<=connections; i++) {
        loadTest()
    }
}


main()

setTimeout(() => {
    console.log(timeList)

    let avg = 0
    timeList.forEach((v) => { avg += v })
    avg /= timeList.length

    console.log("Average: ", avg)
}, 500)