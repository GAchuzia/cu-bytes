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

  scrollContent: {
    alignItems: 'center',
    paddingBottom: h(6),
    width: w(100),
  },

  scrollView: {
    alignSelf: 'stretch',
    flex: 1,
  },

  headerContainer: {
    backgroundColor: '#C5151A',
    width: w(10),
  },

  bodyContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    width: w(100),
  },

  statusbar: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: h(1),
    paddingHorizontal: w(2),
    textAlign: 'center',
    width: w(100),
  },

  headerButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: h(1.2),
    paddingHorizontal: w(3),
    minWidth: w(18),
    maxHeight: h(6),
  },

  headerButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '600',
    textAlign: 'center',
  },

  headerTitle: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(280),
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    flex: 1,
  },

  headerUsernameIcon: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(110),
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: w(1),
    maxWidth: w(15),
  },

  infoText: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '500',
    marginTop: h(0.5),
    paddingTop: h(5),
    paddingBottom: h(5),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(100),
  },

  placeholderText: {
    backgroundColor: '#666666',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '500',
    marginTop: h(0.5),
    paddingTop: h(10),
    paddingBottom: h(10),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(80),
  },

  foodInfoText: {
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderTopColor: '#666666',
    borderBottomColor: '#666666',
    color: '#131312',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '600',
    marginTop: h(1.5),
    marginBottom: h(1.5),
    paddingTop: h(5),
    paddingBottom: h(5),
    paddingLeft: w(5),
    paddingRight: w(5),
    textAlign: 'center',
    shadowColor: '#131312',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 10,
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
    fontSize: font(100),
    fontWeight: '400',
    padding: w(1.5),
  },

});
