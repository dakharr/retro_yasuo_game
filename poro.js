class poro
{
    constructor(posx, posy, walkDst, spriteManager)
    {
        this.walkDst = walkDst/2;
        this.posx = posx;

        this.poro = new BABYLON.Sprite("poro", spriteManager);
        this.poro.position = new BABYLON.Vector3(posx, posy+0.25, 0);
        
        this.poro.playAnimation(16, 23, true, 100);

        this.startTime = Date.now();
        this.speed = 0.001;
        this.offsetTrigger = 0.95;
    }

    update()
    {
        let value = Math.sin((Date.now() - this.startTime) *this.speed)*this.walkDst;
        this.poro.position.x = this.posx + value;

        if(value>this.offsetTrigger*this.walkDst)
            this.poro.invertU = true;
        else if(value<-this.offsetTrigger*this.walkDst)
            this.poro.invertU = false;

    }


}