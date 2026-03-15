import { StyleSheet } from 'react-native';
import { w, h, font } from './dimensions';

export const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'center',
    width: w(100),
  },

  bodyContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    width: w(100),
  },

  scrollView: {
    alignSelf: 'stretch',
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: h(6.0),
    width: w(100),
  },

  statusbar: {
    alignItems: 'center',
    backgroundColor: '#AB0006',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    width: w(100),
  },

  headerTitle: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(140),
    fontWeight: '800',
    justifyContent: 'center',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    paddingTop: h(0.5),
    paddingBottom: h(0.5),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(60),
  },

  headerUsernameIcon: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '700',
    paddingTop: h(1.0),
    paddingBottom: h(1.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    width: w(40),
  },

  headerButtonDefault: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#131312',
    borderColor: '#666666',    
    borderRadius: 20,
    borderWidth: 2,    
    justifyContent: 'center',
    maxHeight: h(10),    
    minWidth: w(25),
    paddingTop: h(1.0),
    paddingBottom: h(1.0),
    paddingLeft: w(1.0),
    paddingRight: w(1.0),
  },

  headerButtonTextDefault: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '700',
    textAlign: 'center',
  },

  infoText: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    flexDirection: 'row',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '600',
    justifyContent: 'center',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    paddingTop: h(1.0),
    paddingBottom: h(1.0),
    paddingLeft: w(1.0),
    paddingRight: w(1.0),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(100),
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
    fontSize: font(120),
    fontWeight: '600',
    padding: w(1.5),
  },

  row: {
    borderColor: '#131312',
    borderWidth: 1,
    flexDirection: 'column',
  },

  rowCell: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '600',
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
  },

});
