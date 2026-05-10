import socket
import sys

def run_interaction_loop(client_socket):
    """
    The main interaction loop: reading from the console, sending to the server, and printing the response.
    The client is "dumb" and does not perform validation on the commands.
    """
    while True:
        try:
            # Read a command from the user via the console
            user_input = input()
            if not user_input.strip():
                continue

            # Add a newline character (\n) and send to the server as bytes
            message = user_input + "\n"
            client_socket.sendall(message.encode())

            # Wait for a response from the server (the client is blocked until a response is received)
            response = client_socket.recv(4096).decode()
            
            # If the server closed the connection
            if not response:
                break

            # Print the output sent by the server to the screen
            # The server already sends a \n at the end, so we use end=""
            print(response, end="")

        except (EOFError, KeyboardInterrupt):
            # Clean exit if necessary (e.g., Ctrl+C or Ctrl+D)
            break
        except Exception:
            break

def connect_to_server(ip, port):
    """
    Establish a single TCP connection with the server and manage the socket's lifecycle.
    """
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    try:
        # Establish the connection
        client_socket.connect((ip, port))
        
        # Transition to the command loop over the same connection
        run_interaction_loop(client_socket)
        
    except Exception:
        # In case of a connection failure, simply terminate the program
        pass
    finally:
        # Close the connection at the end
        client_socket.close()

def main():
    """
    Entry point: receive IP and port as command-line arguments.
    """
    # Check that we received an IP and port (sys.argv[0] is the script name)
    if len(sys.argv) < 3:
        return

    server_ip = sys.argv[1]
    
    try:
        server_port = int(sys.argv[2])
    except ValueError:
        # If the port is not a valid number
        return

    # Run the client
    connect_to_server(server_ip, server_port)

if __name__ == "__main__":
    main()