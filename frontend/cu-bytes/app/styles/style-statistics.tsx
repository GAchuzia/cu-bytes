import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        alignItems: 'center', // Horizontal
        backgroundColor: '#C5151A',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start', // Vertical
        overflowY: 'scroll',
        textAlign: 'center',
        width: '100%' as any,
    },

    headerContainer: {
        backgroundColor: '#C5151A',
        width: '10%' as any,
    },

    bodyContainer: {
        alignItems: 'center', // Horizontal
        backgroundColor: '#FFFFFF',
        width: '100%' as any,
    },

  statusbar: {
    alignItems: 'center', // Horizontal
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'space-between', // Vertical
    padding: '1.5%' as any,
    textAlign: 'center',
    width: '100%' as any,
  },

  headerButton: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'black',
    color: 'red',
    padding: '1.5%' as any,
    width: '10%' as any,
  },

  headerButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '150%' as any,
    fontWeight: 500,
  },
  
  headerTitle: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '300%' as any,
    fontWeight: 800,
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: '50%' as any,
  },

  headerUsernameIcon: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '150%' as any,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '10%' as any,
  },

})