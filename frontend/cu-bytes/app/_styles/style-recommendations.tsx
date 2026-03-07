import { StyleSheet } from "react-native";
import { w, h, font } from './dimensions';
import { HeaderBackContext } from "@react-navigation/elements";

export const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        backgroundColor: '#C5151A',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'scroll',
        textAlign: 'center',
        width: w(100),
    },

    headerContainer: {
        backgroundColor: '#C5151A',
        width: w(10),
    },

    bodyContainerDefault: {
        alignItems: 'center',
        backgroundColor: 'yellow',
        width: w(100),
    },

    bodyContainerAlt: {
        alignItems: 'center',
        backgroundColor: '#C5151A',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: w(80),
    },

    statusbar: {
        alignItems: 'center',
        backgroundColor: '#C5151A',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: w(1.5),
        textAlign: 'center',
        width: w(80),
    },

    headerButton: {
        alignItems: 'center',
        backgroundColor: '#131312',
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#666666',
        color: 'red',
        padding: w(1.5),
        width: w(10),
    },

    headerButtonText: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        fontFamily: 'arial',
        fontSize: font(150),
        fontWeight: '500',
    },

    headerTitle: {
        backgroundColor: '#C5151A',
        color: '#FFFFFF',
        fontFamily: 'arial',
        fontSize: font(300),
        fontWeight: '800',
        textAlign: 'center',
        textShadowColor: '#131312',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        width: w(50),
    },

    headerUsernameIcon: {
        backgroundColor: '#C5151A',
        color: '#FFFFFF',
        fontFamily: 'arial',
        fontSize: font(150),
        fontWeight: 'bold',
        textAlign: 'center',
        width: w(10),
    },

    infoText: {
        backgroundColor: '#C5151A',
        color: '#FFFFFF',
        fontFamily: 'arial',
        fontSize: font(175),
        fontWeight: '500',
        marginTop: h(0.5),
        paddingTop: h(5),
        paddingBottom: h(5),
        textAlign: 'center',
        textShadowColor: '#131312',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        width: w(80),
    },

    bodyButtonDefault: {
        alignItems: 'center',
        backgroundColor: '#131312',
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#666666',
        
        marginTop: h(1.0),
        marginBottom: h(1.0),
        marginLeft: h(1.0),
        marginRight: h(1.0),
        
        paddingTop: h(5.0),
        paddingBottom: h(5.0),
        paddingLeft: h(8.0),
        paddingRight: h(8.0),

        width: w(20),
    },

    bodyButtonTextDefault: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        fontFamily: 'arial',
        fontSize: font(200),
        fontWeight: '700',
        textAlign: 'center',
    }

});