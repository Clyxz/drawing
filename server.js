const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

var TEST = {
    '0:1': "data:image/png;base64,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",
    '1:1': "data:image/png;base64,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",
    '2:1': "data:image/png;base64,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",
    '0:2': "data:image/png;base64,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",
    '1:2': "data:image/png;base64,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",
    '2:2': "data:image/png;base64,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",
    '0:3': "data:image/png;base64,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",
    '1:3': "data:image/png;base64,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",
    '2:3': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAqmSURBVHhe7ZxbbB3FGcdDEaWIxolxbtjHhPpCUypuMY6dOyEldhNbgiYENRBEgtSEIAKkSV21kqGNFNeNaMutIMASSSO5UEHsPFRFQrSpIDR9aB/apz71DYk4LykJhRjab3Z2Z7/59r7emdk9jPTT0Zw9u3uy/9+3cznnOLPO1josBrECDGMFGMYKMIwVYBgrwDBWgGGsAMNYAYaxAgxjBRjGCjCMFWAYK8AwVoBhrADDWAGGqbyAKaClPZEPm9vIgSWhqgJE7mdb2s62diYyVQM6pprbyXmMUz0BPPqUuRNcDYFzGqRiAlh2uaLHTLHHstwKlREA0bv9uJxmPsABu43ktzBCNQRIhQ9tFCWF79kCj7E43ZF7ZvX8c/61f2u6lmzkVEDAVM0pVZIyfsq3eLm7+wc41XjNb76yCDhy+aI/zG6FLe6Q0Kp8gnTiqy0/mzX//cZryHagvAJYNGL6yCMmiYuGE31o7iJ04JXLFkEKglcuW8jK3+mOziiepB6/kgkAgg5KKkDqc0Tc/BFvhIEBJqNh0Z+cy6InoRN+9aUFsCcbD1TOjv40txW/KXFQRgFO7ctZ87jFI2+AIe8QDEQPnQy+5hh+fsk8OGSqlZ0WTHxYK/5WEOUvwA5KPAbwoDF8o/NqsPB5b5M+esHIrPlvzW51uyNnZD6DTjtDSPkLxJhc7kEYp89xtgf7Cqj6+N4mFHwIHxK4BnZOuCfQ+fMBNRH1r3q7ocb3KbcAwIv++e3dB/f0snkO2aHWARdDLi8GSOTo5S5/n7cYDh/1XnKHBDhnQQ6CnY8A7gy+T+kF1DrG7ula/+v1S17vb5sYePzAKvwSlFj6PmfsywtF6ITDl7j7uEOCuMlm4CCmLECM2K3sAp69v/vbz6yH6AXCQfpuB6J/Z45bcVGMX3E13/mQMyTAFu7gTK5hOf6mFOUPlFrA4Qd72iYh9EEWPWu47Hx8RZrC571NYvQYdOxCeAoOzmT/xCI+fVz+QEkFvLjt1rtH19H0kYONe5aRCyNA1Yf2NomIM/AhISvx6UNNkH9VGQV88LXO7qP9bScG2yYBOX3kYPP2peTyBLD0J+fMhBiW+ZCQnsTpAO58OGUU8IPvr/SD5gJw+s7jdb/t2/LdW8jlAVBimfqcKMSwDJCXokhMP7QsyiUAhtylx/ql0CMc3Dd4A7k8IHe3E4oYlgHyEiHNZCzqpiyRAHfIhZ4H547b/OnkwOD3usnlFVX4QcRbkO2CmNWWIKZLLIUAf8jF6YvcxRaHYPpAsG8tEPEuZDsww/QB8wLQkAtBh426vOG0+x/tIZenrvYx/L3EEoGTZiGSOB0wL8AdcgU4dPS0+6k192y+iVweXH+BnX484k2fu3RByk/9EtMHTArwh9xgv48bEwOdr28abmwml1fskJsGMT1NJP19aUyAPOTKPU+gcfe2m8kVpikuFeDpaRSZ7kszAvz0RdYR0QN3PtBFrtBU+hyYnsbcCll7RQMCpPRx1oHo+/b1/HgBXd2YTV8Qeivk6BV1C/jpnhUsXJE+CR09XfK7TUdaFpMrLEn6HLgVIHHx7UK+yZg+ATDZ94dclnKCg1/sXAZHvXmlP/YWm/5HD9Q+ebGJ8XLThaFF5FVtaBIgTfZZyt5nnO5TqbH3hyv/ceM3xLEn57bCtK/Yyf75h5ovjl/1v782ME4zLr7WSPbRgyYB/mQfHMhxk/aB/dJ3XoXDCv/lJhY6Tx8x/fs5ZGcNKBcgTfZ50GG58zb0+/+6fgk5Q4FA+lLho/Q5F9+eTQ5RjVoBdLoZnO/L7UO7e8kZCkRKnxN0AH3RH7U6UChAnm4Gog842Puj1eQMBRKSPkc4gOjHr5p+bw40pv+cwcG5vsX/+U7+8UmVADrZDy15tHFo30pyhgKJTJ/jDMKfHms8dyf7wdpn72ZzcOGJhbD/R/flnKEpESCln8KB0toHPj40n4YucAr/wt5mvP/0KbZ9+t1kB77avA6KF0DTh4jluEl7+JHl5AzFcuHRqyEdKXSBkz4vfMJn7zsO3muIWSLQGyuXg4IFhKQvx40dkPm+Cvz0Q8fbiPQ5fB+2W2CJAMsIWMFJ6XOyOyhSQFztA7ID1d0OcH5Xi5t70EFS+pzPvUNgeuoum52Vs3QqwumGTGNyYQIi0w9zoHq1xXG7/qCDdOlzPv+LlywhysHpBrjtyEliKEbA89u7WbI4fZy47ED1aovjl78TivR4ugFeJfvHMH3SOw8h6CCLWk4xAh4bWhVS+17i/qOD0tUWB09ORDTuI1ToE+xnh5n47zPz2PSUnwqDHWRPH5ipgLGtXf4PGoK1j9vOo4auPzg58Ru50hcwDcG7wTktLCM+eakpa/rAjARA+uynyzx6FjESIHJHbaWrLQFbGQUzch5hVCA75wA0QNYYsozIRH4BUvqugPDcOXrSj1z0OnWaqevXQ04BNH0uQCQecKCh5+FELnoLKv/CySMgJP0TKPSAAz21D0gzH0yu4VEPmQWc6v3mvSNr5fTl8hcN51Fb7QPSxL8K6QN57gDIlKZPovca2mofCJn4e+1MKyPN5BwDfAdi5hNwoGe5K3AnP8RBucsfyCkAYA5I+siBnuUuxh9+sYNSznww+QWwjx+C6XsODj6s9kNmAh1+vfIv58wHk1OAOxGCuMMcdL6xccvobdtG1sIi+eAeHSZo/8PbpS9/IKeA4UeW80oP5dajfXh8Jn9drQJ/9SscVKH8gfxd0OqxDW7KMTgCNDg4v7vZzV04KPfkR5BfAJDswBOgwcHHo+gjoIr0P8CMBAAJDpAArQ4q0v8AMxUAxDmQBQDH7lpKDi8W10FF+h+gAAHAjifXDDx9+9bR2wjLXu0jAg4/2EOOLRzm4IsmIBRpoaBRAABj8rk+rX8+lhuFAob2rXRzRw70CKgQCgUc2L9K5C4cWAEEVQLcv8jA/Y/TtgIIqgQc2t3rhi47gIGB7PkFR5UAaQDwHDw2pO/LmaqgXgByYPufIFoEeA5+uYP94aMFo0oA9DaSABNf0VQCJQJCl2DDe1eQ3SyAEgF2CZYexQKQg6wCxrZ26fxOzRTqBXgO0gt49v5uiN797Zczevc/dwfZp27QIsBxkLgEEyXPQg98pr3uhQ1k//pAk4DEJZj7f0Tj0EWbPWW/f6lLB5oExPQ/EH1I1bPQ0RZo1+l9YFIAjT6dgy2j68l5Ko0SAe6PVqIFREYvGgLnPPzrto7j7serqr/X1IkSAcAN4xtYWB6rX/oWDLCchOhFY2IARgXI/amdvjz26uRg+xub6mZuqkoA0Hk8UM6YeAdO1U/030zOCTgOGD2v9teBBoUCgDwOnOhx1Qdpn9jk7T+47oU7+I1VURlqBQAZHKSIXnD9a54DgSNj1/Dq/ftXie4Ono7s6n1z4y3k8PKgXAAQEhYmY/SCHU+uaZ8MO7OQKp5ODhzZ3EUOLwk6BABRPxziZI0eE263Og40CVAKt3vT+EYaOnlaSgf1IEAAJvgt5cqogoO6EoDhMn7y8PJ7R9ZyK/wpjMn/7vw62dkgdSugKlgBhrECDGMFGMYKMIwVYBgrwDBWgGGsAMNYAYaxAgxjBRjGCjCMFWAYK8AwVoBhrADDWAGGsQIMYwUYxgowjBVgGCvAMFaAUWod/we3nevGFEoJqwAAAABJRU5ErkJggg=="
}
var GLOBAL = {
    workspace: {
        rendering: {
            distance: 2,
            renderlistMaxSize: Math.pow(2 * 2 + 1, 2)
        }
    }
}


server.listen(3000)

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('', (req, res) => {
    res.render('index', {})
})

io.on('connection', socket => {
    socket.on('join', () => {
        io.emit("user connected", {});

        socket.on('disconnect', () => {
            io.emit("user disconnected", {});
        })
    })


    socket.on('get_chunks', function(data) {
        if (!data?.renderlist) {
            return io.to(socket.id).emit("get_chunks", {success: 0, data: "no renderlist"})
        }
        if (data.renderlist.length > GLOBAL.workspace.rendering.renderlistMaxSize) {
            return io.to(socket.id).emit("get_chunks", {success: 0, data: "renderlist to large"})
        }

        let chunkdata = {}
        for (var key of data.renderlist) {
            if (TEST[key]) {
                chunkdata[key] = TEST[key]
            }
        }
        io.to(socket.id).emit("get_chunks", {success: 1, chunkdata: chunkdata})
    })

})