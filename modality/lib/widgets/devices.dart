import 'package:flutter/material.dart';

class DevicesWidget extends StatelessWidget {
  final List<String> devices;

  const DevicesWidget(
      {super.key, this.devices = const ["Entry One", "Entry Two"]});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: devices.length,
      scrollDirection: Axis.vertical,
      itemBuilder: (context, index) {
        return ListTile(
          style: ListTileStyle.drawer,
          title: Text(devices[index]),
        );
      },
    );
  }
}
