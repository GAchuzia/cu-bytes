import { StyleSheet } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
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

  infoText: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '150%' as any,
    fontWeight: 500,
    marginTop: '0.5%' as any,
    paddingTop: '5.0%' as any,
    paddingBottom: '5.0%' as any,
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: '100%' as any,
  },

  placeholderText: {
    backgroundColor: '#666666',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '175%' as any,
    fontWeight: 500,
    marginTop: '0.5%' as any,
    paddingTop: '10.0%' as any,
    paddingBottom: '10.0%' as any,
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: '80%' as any,
  },

  foodInfoText: {
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderTopColor: '#666666',
    borderBottomColor: '#666666',
    color: '#131312',
    fontFamily: 'arial',
    fontSize: '175%' as any,
    fontWeight: 600,
    marginTop: '1.5%' as any,
    marginBottom: '1.5%' as any,
    paddingTop: '5.0%' as any,
    paddingBottom: '5.0%' as any,
    paddingLeft: '5.0%' as any,
    paddingRight: '5.0%' as any,
    textAlign: 'center',
    shadowColor: '#131312',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 10,
    width: '100%' as any,
  },

  columnHeader: {
    borderColor: '#666666',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flexDirection: 'row',
  },

  columnHeaderText: {
    flex: 1,
    fontFamily: 'arial',
    fontSize: '120%' as any,
    fontWeight: 600,
    padding: '1.5%' as any,
  },

  row: {
    borderColor: '#666666',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flexDirection: 'row',
  },

  rowCell: { 
    flex: 1,
    fontFamily: 'arial',
    fontSize: '100%' as any,
    fontWeight: 400,
    padding: '1.5%' as any,
  },

});