const header = document.querySelector('.header')

const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');


const enemy = document.getElementById('enemy');
const again = document.getElementById('again');

const game = {
    ships: [

    ],
    shipCount: 0,
    optionShip: {
        count: [1, 2, 3, 4],
        size: [4, 3, 2, 1]
    },
    collision: [],
    generateShip() {
        for (let i = 0; i < this.optionShip.count.length; i++) {
            for (let j = 0; j < this.optionShip.count[i]; j++) {
                const size = this.optionShip.size[i];

                const ship = this.generateOptionsShip(size);
                this.ships.push(ship);
                this.shipCount++;
            }
        }
    },
    generateOptionsShip(shipSize) {
        const ship2 = {
            hit: [],
            location: [],
        };

        const direction = Math.random() < 0.5;
        let x, y;

        if (direction) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * (10 - shipSize));
        } else {
            x = Math.floor(Math.random() * (10 - shipSize));
            y = Math.floor(Math.random() * 10);
        }

        for (let i = 0; i < shipSize; i++) {
            if (direction) {
                ship2.location.push(x + '' + (y + i));
            } else {
                ship2.location.push((x + i) + '' + y);
            }
            ship2.hit.push('')
        }

        if (this.checkCollision(ship2.location)) {
            return this.generateOptionsShip(shipSize);
        }
        this.addColision(ship2.location);

        return ship2;

    },

    checkCollision(location) {
        for (const coord of location) {
            if (this.collision.includes(coord)) {
                return true;
            }
        }
    },
    addColision(location) {
        for (let i = 0; i < location.length; i++) {
            const startCoordX = location[i][0] - 1

            for (let j = startCoordX; j < startCoordX + 3; j++) {
                const startCoordY = location[i][1] - 1

                for (let z = startCoordY; z < startCoordY + 3; z++) {

                    if (j >= 0 && j < 10 && z >= 0 && z < 10) {

                        const coord = j + '' + z
                        if (!this.collision.includes(coord)) {
                            this.collision.push(coord);
                        }
                    }
                }
            }
        }
    }

};

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0,
    shot: 0,
    hit: 0,
    dead: 0,

    set updateData(data) {
        this[data] += 1;
        this.render();
    },

    render() {
        record.textContent = this['record'];
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    },

};

const show = {
    hit(elem) {
        this.changeClass(elem, 'hit');
    },
    miss(elem) {
        this.changeClass(elem, 'miss');
    },
    dead(elem) {
        this.changeClass(elem, 'dead');
    },

    changeClass(elem, value) {
        elem.className = value;
    }
};

const fire = (e) => {
    const target = e.target;
    if (target.classList.length !== 0 || target.tagName !== 'TD' || game.shipCount === 0) return;

    show.miss(target);
    play.updateData = 'shot';

    for (let i = 0; i < game.ships.length; i++) {
        const ship = game.ships[i];
        const index = ship.location.indexOf(target.id)
        if (index >= 0) {
            show.hit(target)
            play.updateData = 'hit';
            ship.hit[index] = 'x';

            if (!ship.hit.includes('')) {
                play.updateData = 'dead';
                for (const cell of ship.location) {
                    show.dead(document.getElementById(cell));
                }

                game.shipCount -= 1;

                if (game.shipCount < 1) {
                    header.textContent = 'GAME OVER!'
                    header.style.color = 'red';

                    if (play.shot < play.record || play.record === 0) {
                        localStorage.setItem('seaBattleRecord', play.shot);
                        play.record = play.shot;
                        play.render();
                    }

                }

            }

        }
    }
};

const init = () => {
    enemy.addEventListener('click', fire)
    play.render();
    game.generateShip();
    again.addEventListener('click', () => {
        location.reload();
    });
    record.addEventListener('click', () => {
        localStorage.clear()
        play.record = 0;
        play.render();
    });

    console.log(game)
};

init();