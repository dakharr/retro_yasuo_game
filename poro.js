class poro
{
    constructor(posx, posy, walkDst, spriteManager, scene)
    {
        this.walkDst = walkDst/2;
        this.posx = posx;

        this.poro = new BABYLON.Sprite("poro", spriteManager);
        this.poro.position = new BABYLON.Vector3(posx, posy+0.25, 0);

        this.poroHitbox = BABYLON.Mesh.CreateBox("porohit", 0.5, scene);
        this.poroHitbox.isVisible = false;
        this.poroHitbox.isPickable = true;

        this.poro.playAnimation(16, 23, true, 100);

        this.startTime = Date.now();
        this.speed = 0.001;
        this.offsetTrigger = 0.95;
        this.dead = false;
    }

    update(respawnPoint)
    {
        if(!this.dead)
        {
            let value = Math.sin((Date.now() - this.startTime) *this.speed)*this.walkDst;
            this.poro.position.x = this.posx + value;

            if(value>this.offsetTrigger*this.walkDst)
                this.poro.invertU = true;
            else if(value<-this.offsetTrigger*this.walkDst)
                this.poro.invertU = false;

            this.poroHitbox.position = this.poro.position;

            //collision
            if(BABYLON.Vector3.Distance(player.position, this.poro.position)<0.4)
            {
                hitPlayer(respawnPoint);
            }
        }
    }

    kill()
    {
        this.dead = true;
        this.poro.isVisible = false;
    }

    respawn()
    {
        this.dead = false;
        this.poro.isVisible = true;
    }
}