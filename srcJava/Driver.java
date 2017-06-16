import java.awt.Color;
import java.awt.Point;
import java.awt.image.BufferedImage;
import java.util.Arrays;
import java.util.HashMap;

import javax.swing.SwingUtilities;

/**
 * This class Drives the AR Edge Collision program.
 * @author jts
 *
 */
public class Driver {
	public static void main (String[] arg){
		System.out.println("Hello World!");
		
		SwingUtilities.invokeLater(new Runnable() {
            public void run() {
            	            	
            	
				//OutputFrame of = new OutputFrame("OutputFrame");
            	InputHandler ih = new InputHandler(null);
				//ih.loadFile("pic1.png");
            	ih.loadFile();
				
				BufferedImage bi = ih.getFrame();
				
				EdgeData ed = EdgeFilterHolder.getEdgeFilter(40, 40).getEdgeData(bi, 100, 100);
				System.out.printf("ed %dx%d%n", ed.width, ed.height);
				BufferedImage out = new BufferedImage(ed.width, ed.height, BufferedImage.TYPE_4BYTE_ABGR);
				System.out.printf("outbi %dx%d%n", out.getWidth(), out.getHeight());
				java.awt.Graphics2D g2d = out.createGraphics();
				
				g2d.setColor(Color.BLACK);
								
				for (int y = 0; y < ed.height; y++){
					for (int x = 0; x < ed.width; x++){
						if ( 
							ed.dataX[EdgeFilter.xyToPos(x, y, ed.width)] > 0 ||
							ed.dataY[EdgeFilter.xyToPos(x, y, ed.width)] > 0
						){
							//System.out.println("x "+x+":y "+y);
							//out.setRGB(x, y, 0xFFFFFFFF);
							
							//g2d.drawString(".", x, y);
							g2d.drawRect(x, y, 1, 1);
						}
					}
				}
				
				//javax.swing.JOptionPane.showMessageDialog(null, "", "FromDriver", javax.swing.JOptionPane.PLAIN_MESSAGE, new javax.swing.ImageIcon(out));
				System.out.println(ed);
				
				//TODO make the RenderingEngine and PhysicsEngine both receive a reference to a list of AREntities in their constructor?
            	RenderingEngine rendEngine = new RenderingEngine(ih);
            	PhysicsEngine physEngine = new PhysicsEngine(ih);
            	rendEngine.createWindow();
            	//rendEngine.toogleMirror();
            	Ball[] ballList = new Ball[]{
            			new Ball(40),
            			new Ball(30),
            			new Ball(20),
            			new Ball(10),
            			new Ball(5)
            			//new Ball(40, Color.BLUE, Color.MAGENTA, new Point(2,2), new Point(-10, -10), new Point(0,10000), new Point(0, 1), 0.75f, 50)
            			//new Ball(20, Color.BLUE, Color.MAGENTA, new Point(2,2), new Point(10, 0), new Point(0,10000), new Point(0, 1), 0.75f, 50)
            			};
            	rendEngine.addAREntities(Arrays.asList(ballList));
            	physEngine.addAREntities(Arrays.asList(ballList));
            	//rendEngine.addAREntity(new Ball(12));
            	
            	//rendEngine.toogleMirror();
            	
            	rendEngine.run();
            	physEngine.run();
				
				//of.setImage(ih.getFrame());
				
            }
        });
		
		/*
		
		javax.swing.JOptionPane.showMessageDialog(f, "", "FromDriver", javax.swing.JOptionPane.PLAIN_MESSAGE, new javax.swing.ImageIcon(ih.getFrame()));
		java.awt.image.BufferedImage bi = ih.getFrame(); 
		EdgeFilter ef = new EdgeFilter(bi);
		//ef.getEdgeData();
		//javax.swing.JOptionPane.showMessageDialog(f, "", "FromDriver", javax.swing.JOptionPane.PLAIN_MESSAGE, new javax.swing.ImageIcon(ef.getGrayscale()));
		ef.getEdgeData(bi);*/
	}
}
