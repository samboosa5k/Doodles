const TILE_SIZE = 64;

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
        this.scoreArea.innerText = this.score;
        console.log( this.scoreArea );
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
    constructor( csize, bgcolor, theClassname ) {
        this.csize = csize;
        this.bgcolor = bgcolor;
        this.theClassname = theClassname;
    }

    render() {
        this.enemy = document.createElement( 'div' );
        this.enemy.className = `${this.theClassname}`;
        this.enemy.style.width = `${this.csize * TILE_SIZE}px`;
        this.enemy.style.height = `${this.csize * TILE_SIZE}px`;
        this.enemy.style.backgroundColor = `${this.bgcolor}`;
    }

    mount( parent ) {
        //  CHANGE BELOW MAYBE
        this.render();
        parent.appendChild( this.enemy );
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
        const x = document.querySelector( input ).offsetLeft;
        const y = document.querySelector( input ).offsetTop;
        this.selected = document.elementsFromPoint( x, y );
        this.selected.forEach( elem => {
            if ( elem.className === 'enemy' ) {
                this.scoreArea.update( 1 );
            }
        } )
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





document.addEventListener( 'DOMContentLoaded', () => {
    const theParent = document.body;

    const scoreArea = new Score( 1 );

    const createGrid = new Grid( 10, 10, TILE_SIZE, scoreArea );
    createGrid.mount();
    scoreArea.mount( theParent );

    const theEnemy = new Enemy( 1, 'green', 'enemy' );
    theEnemy.mount( theParent );

    const selector = new Selector( 0, 0, TILE_SIZE, 'purple', 'selector' );
    selector.mountExtend( theParent );


    //  KEYPRESSES
    document.addEventListener( 'keydown', ( event ) => {
        switch ( event.code ) {
            case 'ArrowLeft':
                selector.move( 'l' );
                createGrid.paint( '.selector' );
                break;
            case 'ArrowRight':
                selector.move( 'r' );
                createGrid.paint( '.selector' );
                break;
            case 'ArrowDown':
                selector.move( 'd' );
                createGrid.paint( '.selector' );
                break;
            case 'ArrowUp':
                selector.move( 'u' );
                createGrid.paint( '.selector' );
                break;

        }
    } )
} );