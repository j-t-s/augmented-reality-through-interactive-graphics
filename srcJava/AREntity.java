import java.awt.Graphics;
import java.awt.Point;
import java.util.ArrayDeque;
import java.util.Deque;

public abstract class AREntity {
	Point pos, vel, terminalVel, accel;
	float damp = 0.75f;
	Deque<Point> collisionList = new ArrayDeque<Point>();
	int collisionThreshold = 50;
	int collisionCount = 0;
	int edgeXSum = 0;
	int edgeYSum = 0;
	int width;
	int height;
	
	protected abstract void createCollisionMask();//Initializes the collisionList
	public abstract void draw(Graphics g);//Called by RenderEngine
	public abstract void update();//CallBack of PhysicsEngine, update non-physics parts.
	
	AREntity(){
		this(new Point(50, 50), new Point(0, 0), new Point(0, 10), new Point(0, 1), 0.75f, 50);
	}
	
	AREntity(Point pos, Point vel, Point terminalVel, Point accel, float damp, int collisionThreshold){
		this.pos = pos;
		this.vel = vel;
		this.terminalVel = terminalVel; 
		this.accel = accel;
		this.damp = damp;
		this.collisionThreshold = collisionThreshold;
		//this.createCollisionMask();		
	}
	
}
