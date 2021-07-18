import Buffer from "./Buffer"

export default class Texture
{

    private texture: WebGLTexture


    public constructor(private gl: WebGL2RenderingContext,
        private format: number, private base: number, private type: number)
    {
        this.texture = gl.createTexture()!
    }


    public write(width: number, height: number, data: number[]): void
    {
        // Write data to texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1)

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)

        let buffer = Buffer.cast(this.gl, this.type, data)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, width, height, 0, this.base, this.type, buffer)
    }

}
