const theParent = document.body;
const TILE_SIZE = 64;
const GRIDW = 10;
const GRIDH = 10;
const enemies = [];



class Score {
    constructor( score ) {
        this.score = score;
    }
    render() {
        this.scoreArea = document.createElement( 'div' );
        this.scoreArea.className = 'scoreArea';
        this.scoreArea.innerHTML +=
            `
            <h1>${this.score}</h1>
            `;
    }

    mount( parent ) {
        this.render();
        parent.appendChild( this.scoreArea );
    }

    update( addThis ) {
        this.score += addThis;
        this.scoreArea.innerHTML =
            `
        <h1>${this.score}</h1>
        `;
    }
}

class Square {
    constructor( csize, bgcolor, theClassname ) {
        this.csize = csize;
        this.bgcolor = bgcolor;
        this.theClassname = theClassname;
    }

    render() {
        this.square = document.createElement( 'div' );
        this.square.className = `${this.theClassname}`;
        this.square.style.width = `${this.csize}px`;
        this.square.style.height = `${this.csize}px`;
        this.square.style.backgroundColor = `${this.bgcolor}`;
    }

    mount( parent ) {
        //  CHANGE BELOW MAYBE
        this.render();
        parent.appendChild( this.square );
    }
}


class Enemy {
    constructor( csize, bgcolor, theClassname, id ) {
        this.csize = csize;
        this.bgcolor = bgcolor;
        this.theClassname = theClassname;
        this.id = id;
    }

    render() {
        this.enemy = document.createElement( 'div' );
        this.enemy.className = `${this.theClassname}`;
        this.enemy.id = `${this.id}`;
        this.enemy.style.left = `${Math.floor( Math.random() * GRIDW ) * TILE_SIZE}px`;
        this.enemy.style.top = `${Math.floor( Math.random() * GRIDH ) * TILE_SIZE}px`;
        this.enemy.style.width = `${this.csize * TILE_SIZE}px`;
        this.enemy.style.height = `${this.csize * TILE_SIZE}px`;
        this.enemy.style.backgroundColor = `${this.bgcolor}`;
    }

    mount( parent ) {
        //  CHANGE BELOW MAYBE
        this.render();
        parent.appendChild( this.enemy );
    }

    unmount( parent ) {
        parent.removeChild( this.enemy );
        enemies.splice( 0, 1 );
    }
}


class Grid {
    constructor( w, h, csize, scoreArea ) {
        this.w = w;
        this.h = h;
        this.csize = csize;
        this.scoreArea = scoreArea;
    }

    render() {
        this.boody = document.body;
        this.boody.style.width = `${this.w * this.csize}px`;
        this.boody.style.height = `${this.h * this.csize}px`;
    }

    mount() {
        this.render();
        for ( let i = 0; i < this.w * this.h; i++ ) {
            const square = new Square( this.csize, '', 'square' );
            square.mount( this.boody );
        }
    }

    detectSelected( input ) {
        //  THIS IS WHERE YOU GET THE ELEMENT THE SELECTOR IS SELECTING
        const enemyX = document.querySelector( '.enemy' ).style.left;
        const enemyY = document.querySelector( '.enemy' ).style.top;
        const selectorX = input.square.style.left;
        const selectorY = input.square.style.top;

        if ( enemyX === selectorX && enemyY === selectorY ) {
            enemies[0].unmount( theParent );
            scoreArea.update( 1 );
            this.spawnNew();
        };
    }

    spawnNew() {
        const newEnemy = new Enemy( 1, 'green', 'enemy', 0 );
        enemies.push( newEnemy );
        enemies[0].mount( theParent );
    }

    paint( input ) {
        this.detectSelected( input );
        this.selected[1].classList.add( 'square--blink' );
        this.unpaint( this.selected[1] );

    }

    unpaint( input ) {
        setTimeout( () => {
            input.classList.remove( 'square--blink' );
        }, 2000 );
    }
}


class Selector extends Square {
    constructor( x, y, csize, bgcolor, theClassname ) {
        super( csize, bgcolor, theClassname );
        this.x = x;
        this.y = y;
    }

    move( direction ) {
        switch ( direction ) {
            case 'l':
                this.x -= 1;
                break;
            case 'r':
                this.x += 1;
                break;
            case 'u':
                this.y -= 1;
                break;
            case 'd':
                this.y += 1;
                break;
        }

        this.update();
    }

    renderExtend() {
        this.render();
        this.square.style.left = `${this.x}`;
        this.square.style.top = `${this.y}`;
        this.square.backgroundColor = `${this.bgcolor}`;
    }

    mountExtend( parent ) {
        this.renderExtend();
        parent.appendChild( this.square );
    }

    update() {
        this.square.style.left = `${this.x * TILE_SIZE}px`;
        this.square.style.top = `${this.y * TILE_SIZE}px`;
    }
}


const scoreArea = new Score( 1 );
const createGrid = new Grid( GRIDW, GRIDH, TILE_SIZE, scoreArea );


document.addEventListener( 'DOMContentLoaded', () => {

    createGrid.mount();
    scoreArea.mount( theParent );

    //  Push multiple enemies in array
    enemies.push( new Enemy( 1, 'green', 'enemy', 0 ) );
    enemies[0].mount( theParent );
    //  end

    const selector = new Selector( 0, 0, TILE_SIZE, 'purple', 'selector' );
    selector.mountExtend( theParent );

    //  KEYPRESSES
    document.addEventListener( 'keydown', ( event ) => {
        /* console.log( document.querySelectorAll( '.square--blink' ).length ); */
        const time = new Date();

        switch ( event.code ) {
            case 'ArrowLeft':
                selector.move( 'l' );
                createGrid.detectSelected( selector );
                break;
            case 'ArrowRight':
                selector.move( 'r' );
                createGrid.detectSelected( selector );
                break;
            case 'ArrowDown':
                selector.move( 'd' );
                createGrid.detectSelected( selector );
                break;
            case 'ArrowUp':
                selector.move( 'u' );
                createGrid.detectSelected( selector );
                break;

        }
    } )
} );