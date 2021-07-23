import vertexSrc from "./shader/vertex.glsl"
import fragmentSrc from "./shader/fragment.glsl"

import Image from "./triangle/Image"
import Buffer from "./webgl/Buffer"
import Matrix3 from "./webgl/math/Matrix3"
import Program, { Shader } from "./webgl/Program"
import Texture from "./webgl/Texture"
 
export default class Renderer
{

    private readonly program: Program
    
    private readonly width: number
    private readonly height: number

    private readonly vertices: Buffer
    private readonly colors: Buffer

    
    public constructor(private gl: WebGL2RenderingContext)
    {
        this.width = gl.canvas.width
        this.height = gl.canvas.height

        gl.getExtension("EXT_color_buffer_float")
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

        // Compile shaders
        const vertex = new Shader(gl, gl.VERTEX_SHADER, vertexSrc)
        const fragment = new Shader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

        this.program = new Program(gl, vertex, fragment)

        // Initialize projection matrix
        const matrix = this.program.uniformLocation("u_matrix")
        const projection = Matrix3.projection(this.width, this.height)

        gl.uniformMatrix3fv(matrix, true, projection.data)

        // Bind attributes to buffers
        this.vertices = new Buffer(gl, gl.FLOAT, 2)
        this.colors = new Buffer(gl, gl.UNSIGNED_BYTE, 4)

        this.program.bindAttribute("position", this.vertices)
        this.program.bindAttribute("color", this.colors)
    }


    public attachTexture(texture: Texture): void
    {
        this.program.attachTexture(texture)
    }

    public render(image: Image): void
    {
        const gl = this.gl
        this.program.use()

        gl.viewport(0, 0, this.width, this.height)
        gl.enable(gl.BLEND)

        // Clear canvas
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        const points = image.getPoints()

        this.vertices.write(gl.STATIC_DRAW, points)
        this.colors.write(gl.STATIC_DRAW, image.getColors())

        gl.drawArrays(gl.TRIANGLES, 0, points.length)
    }

}
